INSERT INTO items (name, description)
VALUES
    ('Kubernetes', 'Container orchestration platform'),
    ('ArgoCD', 'GitOps continuous delivery tool'),
    ('Prometheus', 'Metrics monitoring system'),
    ('Grafana', 'Observability visualization platform')
ON CONFLICT DO NOTHING;