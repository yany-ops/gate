package models

import (
	"strings"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name   string
	Email  string `gorm:"uniqueIndex"`
	Groups []Group `gorm:"many2many:user_groups;"`
	Roles  []Role  `gorm:"many2many:user_roles;"`
}

// HasPermission checks if the user has permission to perform the specified action
// through any of their roles
func (u *User) HasPermission(db *gorm.DB, apiVersion, method, path string) (bool, error) {
	var roles []Role
	if err := db.Preload("Actions").Model(u).Association("Roles").Find(&roles); err != nil {
		return false, err
	}

	// Check direct role permissions
	for _, role := range roles {
		if role.HasPermission(apiVersion, method, path) {
			return true, nil
		}
	}

	// Check group role permissions
	var groups []Group
	if err := db.Preload("Roles.Actions").Model(u).Association("Groups").Find(&groups); err != nil {
		return false, err
	}

	for _, group := range groups {
		for _, role := range group.Roles {
			if role.HasPermission(apiVersion, method, path) {
				return true, nil
			}
		}
	}

	return false, nil
}

// CheckK8sPermission is a helper method that parses a Kubernetes API path
// and checks permissions
func (u *User) CheckK8sPermission(db *gorm.DB, method, path string) (bool, error) {
	// Extract API version from path (e.g., /api/v1 or /apis/apps/v1)
	parts := strings.Split(path, "/")
	var apiVersion string
	
	if len(parts) > 2 {
		if parts[1] == "apis" && len(parts) > 3 {
			apiVersion = parts[2] + "/" + parts[3] // e.g., "apps/v1"
		} else if parts[1] == "api" {
			apiVersion = parts[2] // e.g., "v1"
		}
	}

	return u.HasPermission(db, apiVersion, method, path)
}
