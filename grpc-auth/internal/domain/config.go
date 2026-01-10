package domain

type ServerConfig struct {
	RestPort string `yaml:"rest_port"`
	GrpcPort string `yaml:"grpc_port"`
}

type DBConfig struct {
	Url string `yaml:"url"`
}

type JwtConfig struct {
	Path string `yaml:"path"`
}

type Config struct {
	Server    ServerConfig `yaml:"server"`
	DB        DBConfig     `yaml:"db"`
	JwtConfig JwtConfig    `yaml:"jwt"`
}
