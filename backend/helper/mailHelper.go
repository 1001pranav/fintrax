package helper

import (
	"net/smtp"
	"os"
)

func SendEmail(to string, subject string, body string) error {
	from := os.Getenv("EMAIL")
	password := os.Getenv("EMAIL_PASSWORD")

	// Set up authentication information.
	auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")

	// Connect to the server, authenticate, and send the email.
	err := smtp.SendMail("smtp.gmail.com:587", auth, from, []string{to}, []byte("Subject: "+subject+"\r\n\r\n"+body))
	if err != nil {
		return err
	}
	return nil
}
