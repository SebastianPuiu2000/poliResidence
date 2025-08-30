package routers

import (
	"server/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterTaxesRouter(r *gin.Engine) {
	api := r.Group("/taxes")
	{
		api.POST("/upload", controllers.ImportTaxes)
	}
}
