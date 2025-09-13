package middlewares

import (
	"errors"
	"net/http"
	"server/configs"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func authBaseMiddleware(c *gin.Context) (jwt.MapClaims, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return nil, errors.New("missing Authorization header")
	}

	// Expect "Bearer <token>"
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return nil, errors.New("invalid Authorization header format")
	}

	tokenString := parts[1]

	// Parse and validate JWT
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Must verify that token was signed with same algorithm from login
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return configs.JwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid or expired token")
	}

	// Extract claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Make sure that token contains id and save it in the request
		id, ok := claims["id"].(string)
		if !ok || id == "" {
			return nil, errors.New("missing id from token")
		}
		c.Set("id", id)

		// Everything went well, claims can be returned
		return claims, nil
	}

	return nil, errors.New("failed to parse claims")
}

func AuthUserMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := authBaseMiddleware(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Continue if everything is valid
		c.Next()
	}
}

func AuthAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := authBaseMiddleware(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Admin flag check
		if isAdmin, ok := claims["isAdmin"].(bool); !ok || !isAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "admin access required"})
			c.Abort()
			return
		}

		// Continue if everything is valid
		c.Next()
	}
}
