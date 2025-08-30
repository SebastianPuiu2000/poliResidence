package controllers

import (
	"log"
	"net/http"
	"server/managers"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// Hash password
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Compare password
func checkPassword(hashedPwd, plainPwd string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPwd), []byte(plainPwd))
	return err == nil
}

func ImportUsers(c *gin.Context) {
	count, err := managers.GetUsersCount()
	if err != nil {
		c.String(http.StatusBadRequest, "Database problem")
		return
	}
	if count > 0 {
		c.String(http.StatusConflict, "Users already created")
		return
	}

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

	users := []interface{}{}
	for _, row := range rows {
		if len(row) == 0 {
			continue
		}

		encryptedPassword, err := hashPassword(row[1])
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to encrypt passwords")
			return
		}

		users = append(users, bson.M{
			"id":       row[0],
			"password": encryptedPassword,
		})

	}

	if err := managers.InsertManyUsers(users); err != nil {
		log.Println("Failed to insert many users:", err)
		c.String(http.StatusInternalServerError, "Failed to import users")
		return
	}

	c.String(http.StatusOK, "Success")
}

func Login(c *gin.Context) {
	var input struct {
		ID       string `json:"id"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user managers.User
	user, err := managers.FindOneUser(input.ID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	if !checkPassword(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "login successful"})
}
