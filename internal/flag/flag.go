package flag

import (
	flag "github.com/spf13/pflag"
)

var (
	Cfg Config
)

type Config struct {
	ListenAddr string
}

func NewFlagSet() *flag.FlagSet {
	fs := flag.NewFlagSet("gate", flag.ContinueOnError)

	fs.StringVar(&Cfg.ListenAddr, "listen-addr", ":8080", "listen address")
	return fs
}
