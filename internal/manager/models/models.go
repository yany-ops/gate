package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents an authenticated user in the system
type User struct {
	gorm.Model
	Email       string `gorm:"uniqueIndex;not null"`
	DisplayName string
	Groups      []Group `gorm:"many2many:user_groups;"`
}

// Group represents a group that users can belong to
type Group struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;not null"`
	Description string
	Users       []User `gorm:"many2many:user_groups;"`
	Roles       []Role `gorm:"many2many:group_roles;"`
}

// Role represents a role that can be assigned to groups
type Role struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;not null"`
	Description string
	Groups      []Group `gorm:"many2many:group_roles;"`
	Permissions []Permission
}

// Permission represents a specific permission that can be granted
type Permission struct {
	gorm.Model
	Resource []string  `gorm:"type:text[]"`
	Action   []string  `gorm:"type:text[]"`
	Cluster  []Cluster `gorm:"many2many:cluster_permissions;"`
	RoleID   uint
	Role     Role
	GroupID  uint
	Group    Group
}

// Cluster represents a Kubernetes cluster registered in the proxy
type Cluster struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;not null"`
	Description string
	Type        string `gorm:"not null"` // "eks" or "incluster"
	Endpoint    string `gorm:"not null"`
	Region      string // For EKS clusters
	Status      string `gorm:"not null"` // "active", "inactive", "error"
	LastSync    time.Time
}

// AuditLog represents an audit log entry for tracking access
type AuditLog struct {
	gorm.Model
	UserID    uint
	User      User
	ClusterID uint
	Cluster   Cluster
	Action    string `gorm:"not null"`
	Resource  string `gorm:"not null"`
	Status    string `gorm:"not null"` // "success", "failure"
	IP        string
	UserAgent string
	Timestamp time.Time `gorm:"not null"`
}
