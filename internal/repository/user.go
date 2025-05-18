package repository

import (
	"github.com/yany-ops/gate/internal/manager/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateUser(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) DeleteUser(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *UserRepository) GetUserWithPermissions(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.Preload("Groups.Roles.Permissions").First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
