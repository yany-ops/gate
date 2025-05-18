package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/db"
	"github.com/yany-ops/gate/internal/manager/models"
	"github.com/yany-ops/gate/internal/repository"
	"go.uber.org/zap"
)

type UserHandlers struct {
	config         *config.Config
	logger         *zap.Logger
	userRepository *repository.UserRepository
}

func userHandlers(config *config.Config, db *db.DB, logger *zap.Logger) *UserHandlers {
	return &UserHandlers{config: config, userRepository: repository.NewUserRepository(db.DB), logger: logger}
}

func (h *UserHandlers) SetupRouter() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{email}", h.GetUser)
	router.Post("/", h.CreateUser)
	router.Put("/{email}", h.UpdateUser)
	router.Delete("/{email}", h.DeleteUser)
	return router
}

func (h *UserHandlers) GetUser(w http.ResponseWriter, r *http.Request) {
	email := chi.URLParam(r, "email")
	user, err := h.userRepository.GetUserByEmail(email)
	if err != nil {
		h.logger.Error("Failed to get user", zap.Error(err))
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (h *UserHandlers) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		h.logger.Error("Failed to decode user", zap.Error(err))
		http.Error(w, "Failed to decode user", http.StatusBadRequest)
		return
	}

	if err := h.userRepository.CreateUser(&user); err != nil {
		h.logger.Error("Failed to create user", zap.Error(err))
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
}

func (h *UserHandlers) UpdateUser(w http.ResponseWriter, r *http.Request) {
	email := chi.URLParam(r, "email")
	var user *models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		h.logger.Error("Failed to decode user", zap.Error(err))
		http.Error(w, "Failed to decode user", http.StatusBadRequest)
		return
	}

	user, err := h.userRepository.GetUserByEmail(email)
	if err != nil {
		h.logger.Error("Failed to get user", zap.Error(err))
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	if err := h.userRepository.UpdateUser(user); err != nil {
		h.logger.Error("Failed to update user", zap.Error(err))
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte("User updated successfully"))
	if err != nil {
		h.logger.Error("Failed to write response", zap.Error(err))
	}
}

func (h *UserHandlers) DeleteUser(w http.ResponseWriter, r *http.Request) {
	email := chi.URLParam(r, "email")
	user, err := h.userRepository.GetUserByEmail(email)
	if err != nil {
		h.logger.Error("Failed to delete user", zap.Error(err))
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	if err := h.userRepository.DeleteUser(user.ID); err != nil {
		h.logger.Error("Failed to delete user", zap.Error(err))
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, err = w.Write([]byte("User deleted successfully"))
	if err != nil {
		h.logger.Error("Failed to write response", zap.Error(err))
	}
}
