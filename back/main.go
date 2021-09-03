package main

import (
	"io"
	"net/http"
	"os"

	echo "github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	e.GET("/check", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.POST("/upload", Upload)

	e.Logger.Fatal(e.Start(":1323"))
}

func Upload(c echo.Context) error {
	name := c.FormValue("name")
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

	return c.HTML(http.StatusOK, "<b>Thank you! "+name+"</b>")
}
