package flag

import (
	flag "github.com/spf13/pflag"
)

var (
	Cfg Config
)

type Config struct {
	ListenAddr string
	Token      string
}

func NewFlagSet() *flag.FlagSet {
	fs := flag.NewFlagSet("gate", flag.ContinueOnError)

	fs.StringVar(&Cfg.ListenAddr, "listen-addr", ":8080", "listen address")
	fs.StringVar(&Cfg.Token, "token", "serviceaccount", "token used for authentication (default: serviceaccount)")
	return fs
}
