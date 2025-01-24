package main

import (
	"fmt"

	"github.com/YanyChoi/gate/internal/agent"
	"github.com/spf13/cobra"
)

func main() {
	rootCmd := &cobra.Command{
		Short: "Gate is the ultimate gate for servers",
		Long:  "Gate is the ultimate gate for servers",
	}
	rootCmd.AddCommand(startCmd())
	rootCmd.Execute()
}

func startCmd() *cobra.Command {
	return &cobra.Command{
		Use: "start",
		Short: "Start the agent",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Starting the agent")
			agent := agent.New()
			agent.Start()
		},
	}
}
