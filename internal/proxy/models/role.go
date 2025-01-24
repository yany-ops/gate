package models

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name    string
	Users   []User `gorm:"many2many:user_roles;"`
	Groups  []Group `gorm:"many2many:group_roles;"`
	Actions []Action
}

// HasPermission checks if the role allows a specific API action
func (r *Role) HasPermission(apiVersion, method, path string) bool {
	for _, action := range r.Actions {
		if action.APIVersion == apiVersion && 
		   action.Method == method && 
		   action.Path == path {
			return true
		}
	}
	return false
}

type Action struct {
	gorm.Model
	Name       string
	APIVersion string
	Method     string
	Path       string
}
