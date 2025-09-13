package main

import (
	"server/configs"
	"server/database"
	"server/routers"
	"server/services"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	configs.LoadDbConnectionString()
	configs.LoadJwt()

	database.ConnectMongo()

	services.PopulateTaxes()

	routers.RegisterTaxesRouter(r)
	routers.RegisterUsersRouter(r)

	// Start server
	r.Run(":8080") // listen on port 8080
}
