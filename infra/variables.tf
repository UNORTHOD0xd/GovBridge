variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "govbridge"
}

variable "db_password" {
  description = "Password for the RDS PostgreSQL instance"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "Username for the RDS PostgreSQL instance"
  type        = string
  default     = "govbridge_admin"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "govbridge"
}

variable "eks_node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.small"
}

variable "eks_node_count" {
  description = "Desired number of EKS worker nodes"
  type        = number
  default     = 2
}
