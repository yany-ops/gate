package db

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB struct {
	db *gorm.DB
}

func New(dsn string) *DB {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return &DB{db: db}
}

func (d *DB) Migrate() {
	// d.db.AutoMigrate(&User{})
}

func (d *DB) GetDB() *gorm.DB {
	return d.db
}
