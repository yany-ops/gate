package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/yany-ops/gate/internal/manager/auth"
	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/db"
	"github.com/yany-ops/gate/internal/repository"
	"go.uber.org/zap"
)

type RBACHandlers struct {
	config         *config.Config
	logger         *zap.Logger
	auth           *auth.Auth
	userRepository *repository.UserRepository
}

func rbacHandlers(config *config.Config, db *db.DB, logger *zap.Logger, auth *auth.Auth) *RBACHandlers {
	return &RBACHandlers{config: config, userRepository: repository.NewUserRepository(db.DB), logger: logger, auth: auth}
}

func (h *RBACHandlers) SetupRouter() *chi.Mux {
	router := chi.NewRouter()
	router.Post("/user_authorized", h.IsUserAuthorized)
	return router
}

func (h *RBACHandlers) IsUserAuthorized(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		h.logger.Error("Failed to read request body", zap.Error(err))
		http.Error(w, "Failed to check authorization", http.StatusInternalServerError)
		return
	}

	var requestBody struct {
		Resource  string `json:"resource"`
		Action    string `json:"action"`
		UserEmail string `json:"user"`
	}

	if err := json.Unmarshal(body, &requestBody); err != nil {
		h.logger.Error("Failed to unmarshal request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	user, err := h.userRepository.GetUserByEmail(requestBody.UserEmail)
	if err != nil {
		h.logger.Error("Failed to get user by email", zap.Error(err))
		http.Error(w, "No such user", http.StatusNotFound)
		return
	}

	// Check if user is in admin list
	for _, adminEmail := range h.config.Admins {
		if user.Email == adminEmail {
			json.NewEncoder(w).Encode(map[string]bool{"authorized": true})
			return
		}
	}

	// Get user's groups and their roles
	userWithGroups, err := h.userRepository.GetUserWithPermissions(user.ID)
	if err != nil {
		h.logger.Error("Failed to load user permissions", zap.Error(err))
		http.Error(w, "Failed to load user permissions", http.StatusInternalServerError)
		return
	}

	for _, group := range userWithGroups.Groups {
		for _, role := range group.Roles {
			for _, permission := range role.Permissions {
				for _, res := range permission.Resource {
					if res == requestBody.Resource {
						for _, act := range permission.Action {
							if act == requestBody.Action {
								json.NewEncoder(w).Encode(map[string]bool{"authorized": true})
								return
							}
						}
					}
				}
			}
		}
	}

	// If no permissions match, user is not authorized
	json.NewEncoder(w).Encode(map[string]bool{"authorized": false})
}
