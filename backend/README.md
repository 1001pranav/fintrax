# Fintrax Backend

## Installation of modules
```
go mod init github.com/pranav/fintrax #Installs all the modules

go list -m all         # list all modules
go mod verify          # verify downloaded modules
```

## Migrations 

### Install `golang-migrate`
```brew install golang-migrate  # macOS```

### Head to the path and run the migration cmd
```
migrate -path backend/migrations 
  -database "postgres://pranavrnayakn:@localhost:5432/fintrax_db?sslmode=disable" up
```

## Run Backend
`go run main.go`
