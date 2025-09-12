package services

import (
	"server/managers"
	"strconv"
	"strings"
	"unicode"

	"go.mongodb.org/mongo-driver/bson"
)

var months = []string{"IANUARIE", "FEBRUARIE", "MARTIE", "APRILIE", "MAI", "IUNIE", "IULIE", "AUGUST", "SEPTEMBRIE", "OCTOMBRIE", "NOIEMBRIE", "DECEMBRIE"}

func PopulateTaxes() error {

	count, err := managers.GetTaxesCount()
	if err != nil || count > 0 {
		return nil
	}

	var objects []interface{}
	for i := 1; i <= 98; i++ {
		objects = append(objects, bson.M{
			"id":          strconv.Itoa(i),
			"information": bson.M{}, // default placeholder
		})
	}

	err = managers.InsertManyTaxes(objects)
	if err != nil {
		return err
	}

	return nil
}

func ExtractMonthYear(input string) (month string, year string, ok bool) {
	parts := strings.Fields(input)
	n := len(parts)

	if n < 2 {
		return "", "", false // not enough words
	}

	month = parts[n-2]
	year = parts[n-1]
	return month, year, true
}

func ValidateMonthYear(month string, year string) bool {
	// check year is 4 digits
	if len(year) != 4 {
		return false
	}
	for _, r := range year {
		if !unicode.IsDigit(r) {
			return false
		}
	}

	// check month is in list
	for _, m := range months {
		if month == m {
			return true
		}
	}

	return false
}

func FindLatestYearMonth(info bson.M) (string, string) {
	if len(info) == 0 {
		return "", ""
	}

	// Find max year
	maxYear := ""
	for y := range info {
		if maxYear == "" || y > maxYear {
			maxYear = y
		}
	}

	yearObj, ok := info[maxYear].(bson.M)
	if !ok {
		return maxYear, ""
	}

	// Find the latest month by iterating months in order
	var maxMonth string
	for _, m := range months {
		if _, exists := yearObj[m]; exists {
			maxMonth = m
		}
	}

	return maxYear, maxMonth
}

func FindPrevNext(info bson.M, yearStr, month string) (map[string]string, map[string]string) {
	// find index of current month
	idx := -1
	for i, m := range months {
		if m == month {
			idx = i
			break
		}
	}
	if idx == -1 {
		return nil, nil
	}

	year, _ := strconv.Atoi(yearStr)

	// previous
	var prev map[string]string
	if idx > 0 {
		prevMonth := months[idx-1]
		if y, ok := info[yearStr].(bson.M); ok {
			if _, exists := y[prevMonth]; exists {
				prev = map[string]string{"year": yearStr, "month": prevMonth}
			}
		}
	} else { // wrap to previous year
		prevYear := strconv.Itoa(year - 1)
		if y, ok := info[prevYear].(bson.M); ok {
			lastMonth := months[len(months)-1]
			if _, exists := y[lastMonth]; exists {
				prev = map[string]string{"year": prevYear, "month": lastMonth}
			}
		}
	}

	// next
	var next map[string]string
	if idx < len(months)-1 {
		nextMonth := months[idx+1]
		if y, ok := info[yearStr].(bson.M); ok {
			if _, exists := y[nextMonth]; exists {
				next = map[string]string{"year": yearStr, "month": nextMonth}
			}
		}
	} else { // wrap to next year
		nextYear := strconv.Itoa(year + 1)
		if y, ok := info[nextYear].(bson.M); ok {
			firstMonth := months[0]
			if _, exists := y[firstMonth]; exists {
				next = map[string]string{"year": nextYear, "month": firstMonth}
			}
		}
	}

	return prev, next
}
