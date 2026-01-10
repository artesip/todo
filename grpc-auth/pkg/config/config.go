package config

import (
	"fmt"
	"grpc-auth/internal/domain"
	"os"

	"gopkg.in/yaml.v3"
)

func LoadConfig(path string) (domain.Config, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return domain.Config{}, fmt.Errorf("error reading config file: %w", err)
	}

	var config domain.Config
	if err := yaml.Unmarshal(file, &config); err != nil {
		return domain.Config{}, fmt.Errorf("error unmarshaling YAML: %w", err)
	}
	return config, nil
}
