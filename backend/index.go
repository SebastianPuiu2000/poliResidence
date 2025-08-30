package main

import (
	"server/database"
	"server/routers"
	"server/services"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	database.ConnectMongo()

	services.PopulateTaxes()

	routers.RegisterTaxesRouter(r)

	routers.RegisterUsersRouter(r)

	// Start server
	r.Run(":8080") // listen on port 8080
}
