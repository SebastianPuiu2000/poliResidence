package main

import (
	"fmt"
	"log"
	"net/http"
	"server/database"
	"server/managers"
	"server/services"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	r := gin.Default()

	database.ConnectMongo()

	services.PopulateTaxes()

	// Route: upload Excel file and parse
	r.POST("/upload", func(c *gin.Context) {
		// Get uploaded file
		file, err := c.FormFile("myfile")
		if err != nil {
			c.String(http.StatusBadRequest, "Failed to get file: %v", err)
			return
		}

		uploadedFile, err := file.Open()
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to open uploaded file: %v", err)
			return
		}
		defer uploadedFile.Close()

		// Open excelize file from stream
		f, err := excelize.OpenReader(uploadedFile)
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to parse Excel: %v", err)
			return
		}
		defer f.Close()

		// Read rows from first sheet
		rows, err := f.GetRows("Sheet1")
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to read rows: %v", err)
			return
		}

		// Print rows (just for debugging)
		var filteredRows [][]string
		for i, row := range rows {
			fmt.Printf("Row %d: %v\n", i+1, row)

			// skip empty rows
			if len(row) == 0 {
				continue
			}

			_, err := strconv.Atoi(row[0])
			if err != nil {
				continue // skip if not a number
			}

			var cleanedRow []string
			for _, cell := range row {
				if cell == "" {
					cleanedRow = append(cleanedRow, "-")
				} else {
					cleanedRow = append(cleanedRow, cell)
				}
			}

			filteredRows = append(filteredRows, cleanedRow)
		}

		now := time.Now()    // get current date and time
		year := now.Year()   // extract year
		month := now.Month() // extract month (returns time.Month type)

		for _, row := range filteredRows { // outer loop: each row
			id := row[0]
			update := bson.M{
				"$set": bson.M{
					"information." + strconv.Itoa(year) + "." + month.String(): bson.M{"B": row[1], "C": row[2], "D": row[3], "E": row[4], "F": row[5], "G": row[6], "H": row[7], "I": row[8], "J": row[9], "K": row[10], "L": row[11], "M": row[12], "N": row[13], "O": row[14], "P": row[15], "Q": row[16], "R": row[17], "S": row[18], "T": row[19]},
				},
			}

			if err := managers.UpdateOneTax(id, update); err != nil {
				log.Fatal("Failed to update documents:", err)
			}

		}

		// Return as JSON
		c.JSON(http.StatusOK, gin.H{
			"sheet": "Sheet1",
			"rows":  filteredRows,
		})
	})

	// Start server
	r.Run(":8080") // listen on port 8080
}
