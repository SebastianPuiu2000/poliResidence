package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterTaxesRouter(r *gin.Engine) {
	api := r.Group("/taxes")
	{
		api.GET("/", middlewares.AuthUserMiddleware(), controllers.GetTaxes)
		api.POST("/upload", middlewares.AuthAdminMiddleware(), controllers.ImportTaxes)
	}
}
