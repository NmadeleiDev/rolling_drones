package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	echo "github.com/labstack/echo/v4"
)

type Response struct {
	Msg string `json:"msg"`
}

type Datatsets struct {
	Datatsets []Datatset `json:"datasets"`
}

type Datatset struct {
	Name string `json:"name"`
}

func main() {
	e := echo.New()
	e.GET("/check", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.POST("/data", Upload)
	e.PUT("/data", Replace)
	e.GET("/datasets", GetDatasets)
	e.Logger.Fatal(e.Start(":1323"))
}

func Upload(c echo.Context) error {
	dataset_name := c.FormValue("name")
	// Get avatar
	sef, err := c.FormFile("social_economy_forecast")
	if err != nil {
		return fmt.Errorf("file not found: %v", err)
	}

	// Source
	src, err := sef.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(sef.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	// func Process File

	return c.JSON(http.StatusOK, &Response{Msg: dataset_name + " uploaded"})
}

func Replace(c echo.Context) error {
	dataset_name := c.FormValue("name")
	// Get avatar
	sef, err := c.FormFile("social_economy_forecast")
	if err != nil {
		return err
	}

	// Source
	src, err := sef.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(sef.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	// func Replace in DB with new content

	return c.JSON(http.StatusOK, &Response{Msg: dataset_name + " replaced"})
}

func GetDatasets(c echo.Context) error {
	var datatsets Datatsets
	for i := 0; i < 10; i++ {
		datatsets.Datatsets = append(datatsets.Datatsets, Datatset{Name: fmt.Sprintf("dataset%d", i)})
	}
	c.JSON(http.StatusOK, datatsets)
	return nil
}
