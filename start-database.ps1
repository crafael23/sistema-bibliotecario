# PowerShell script to start a Docker container for a local development database
# Run this script in PowerShell: .\start-database.ps1

$DB_CONTAINER_NAME = "sistema-bibliotecario-postgres"

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed. Please install Docker Desktop for Windows and try again.`nDocker install guide: https://docs.docker.com/docker-for-windows/install/"
    exit 1
}

# Check if Docker daemon is running
try {
    docker info | Out-Null
} catch {
    Write-Error "Docker daemon is not running. Please start Docker Desktop and try again."
    exit 1
}

# Check if container is already running
if (docker ps -q -f "name=$DB_CONTAINER_NAME") {
    Write-Host "Database container '$DB_CONTAINER_NAME' already running"
    exit 0
}

# Check if container exists but is stopped
if (docker ps -q -a -f "name=$DB_CONTAINER_NAME") {
    docker start "$DB_CONTAINER_NAME"
    Write-Host "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
}

# Import environment variables from .env file
$envContent = Get-Content .env
foreach ($line in $envContent) {
    if ($line.Trim() -and -not $line.StartsWith('#')) {
        $parts = $line.Split('=', 2)
        if ($parts.Length -eq 2) {
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

# Extract DB_PASSWORD and DB_PORT from DATABASE_URL
$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
    Write-Error "DATABASE_URL not found in .env file"
    exit 1
}

# Parse DATABASE_URL (format: postgresql://postgres:password@localhost:5432/sistema-bibliotecario)
$pattern = 'postgresql://postgres:([^@]+)@[^:]+:(\d+)/'
if ($databaseUrl -match $pattern) {
    $DB_PASSWORD = $matches[1]
    $DB_PORT = $matches[2]
} else {
    Write-Error "Could not parse DATABASE_URL from .env file"
    exit 1
}

# Check if using default password
if ($DB_PASSWORD -eq "password") {
    Write-Host "You are using the default database password"
    $reply = Read-Host "Should we generate a random password for you? [y/N]"
    if ($reply -match "^[Yy]$") {
        # Generate a random password
        $DB_PASSWORD = -join ((65..90) + (97..122) + (48..57) + (45, 95) | Get-Random -Count 16 | ForEach-Object { [char]$_ })
        
        # Update .env file with new password
        $envContent = Get-Content .env -Raw
        $envContent = $envContent -replace ':password@', ":$DB_PASSWORD@"
        Set-Content -Path .env -Value $envContent
    } else {
        Write-Host "Please change the default password in the .env file and try again"
        exit 1
    }
}

# Start Docker container
docker run -d `
    --name $DB_CONTAINER_NAME `
    -e POSTGRES_USER="postgres" `
    -e POSTGRES_PASSWORD="$DB_PASSWORD" `
    -e POSTGRES_DB=sistema-bibliotecario `
    -p "${DB_PORT}:5432" `
    docker.io/postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database container '$DB_CONTAINER_NAME' was successfully created"
} else {
    Write-Error "Failed to start database container"
} 