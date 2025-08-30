package controllers

import (
	"fmt"
	"log"
	"net/http"
	"server/managers"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func ImportTaxes(c *gin.Context) {
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

	f, err := excelize.OpenReader(uploadedFile)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to parse Excel: %v", err)
		return
	}
	defer f.Close()

	rows, err := f.GetRows("Sheet1")
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to read rows: %v", err)
		return
	}

	var filteredRows [][]string
	for i, row := range rows {
		fmt.Printf("Row %d: %v\n", i+1, row)

		if len(row) == 0 {
			continue
		}

		_, err := strconv.Atoi(row[0])
		if err != nil {
			continue
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

	now := time.Now()
	year := now.Year()
	month := now.Month()

	for _, row := range filteredRows {
		id := row[0]
		update := bson.M{
			"$set": bson.M{
				"information." + strconv.Itoa(year) + "." + month.String(): bson.M{
					"B": row[1], "C": row[2], "D": row[3], "E": row[4], "F": row[5],
					"G": row[6], "H": row[7], "I": row[8], "J": row[9], "K": row[10],
					"L": row[11], "M": row[12], "N": row[13], "O": row[14], "P": row[15],
					"Q": row[16], "R": row[17], "S": row[18], "T": row[19],
				},
			},
		}

		if err := managers.UpdateOneTax(id, update); err != nil {
			log.Println("Failed to update tax:", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"sheet": "Sheet1",
		"rows":  filteredRows,
	})
}
