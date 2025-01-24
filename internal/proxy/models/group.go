package models

import "gorm.io/gorm"

type Group struct {
	gorm.Model
	Name  string
	Users []User `gorm:"many2many:user_groups;"`
	Roles []Role `gorm:"many2many:group_roles;"`
}
