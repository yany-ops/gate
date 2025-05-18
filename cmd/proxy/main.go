package main

import (
	"fmt"
	"net"
	"time"

	"github.com/spf13/cobra"
	"github.com/yany-ops/gate/internal/proxy/flag"
	"github.com/yany-ops/gate/internal/proxy/proxy"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"k8s.io/client-go/rest"
)

type options struct {
	address          string
	port             int
	unixSocket       string
	keepalive        time.Duration
	appendServerPath bool
}

func main() {
	zap.ReplaceGlobals(zap.Must(zap.NewProduction()))

	fs := flag.NewFlagSet()

	rootCmd := &cobra.Command{
		Use: "gate",
		Run: func(cmd *cobra.Command, args []string) {
			RunProxy()
		},
	}
	rootCmd.Flags().AddFlagSet(fs)
	rootCmd.Execute()
}

const (
	defaultPort         = 8080
	defaultStaticPrefix = "/static/"
	defaultAPIPrefix    = "/"
	defaultAddress      = "0.0.0.0"
)

// RunProxy checks given arguments and executes command
func RunProxy() error {
	o := &options{
		address:          defaultAddress,
		port:             defaultPort,
		keepalive:        30 * time.Second,
		appendServerPath: true,
	}

	loggerConfig := zap.NewProductionConfig()
	loggerConfig.EncoderConfig.TimeKey = "timestamp"
	loggerConfig.EncoderConfig.EncodeTime = zapcore.RFC3339TimeEncoder
	logger, err := loggerConfig.Build()

	filter := &proxy.FilterServer{
		AcceptPaths:   proxy.MakeRegexpArrayOrDie(proxy.DefaultPathAcceptRE),
		RejectPaths:   proxy.MakeRegexpArrayOrDie(proxy.DefaultPathRejectRE),
		AcceptHosts:   proxy.MakeRegexpArrayOrDie(proxy.DefaultHostAcceptRE),
		RejectMethods: proxy.MakeRegexpArrayOrDie(proxy.DefaultMethodRejectRE),
	}

	// credentialPath := "/var/run/secrets/kubernetes.io/serviceaccount"
	// host := os.Getenv("KUBERNETES_SERVICE_HOST")
	// port := os.Getenv("KUBERNETES_SERVICE_PORT")

	config, err := rest.InClusterConfig()
	if err != nil {
		return err
	}
	server, err := proxy.NewServer("", defaultAPIPrefix, defaultStaticPrefix, filter, config, o.keepalive, o.appendServerPath, logger)

	if err != nil {
		return err
	}

	// Separate listening from serving so we can report the bound port
	// when it is chosen by os (eg: port == 0)
	var l net.Listener
	if o.unixSocket == "" {
		l, err = server.Listen(o.address, o.port)
	} else {
		l, err = server.ListenUnix(o.unixSocket)
	}
	if err != nil {
		return err
	}
	fmt.Printf("Starting to serve on %s\n", l.Addr().String())
	return server.ServeOnListener(l)
}
