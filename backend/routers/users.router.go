package routers

import (
	"server/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterUsersRouter(r *gin.Engine) {
	api := r.Group("/users")
	{
		api.POST("/upload", controllers.ImportUsers)
		api.POST("/login", controllers.Login)
	}
}
