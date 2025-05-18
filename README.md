# Gate - the ultimate gate for servers

Gate is the proxy for kubernetes clusters, adding OIDC with RBAC controls based on groups, and audit logs stored into S3 buckets.

There are 3 components for this project: proxy, agent, and the CLI client.

## Proxy
The proxy manages the authentication, authorization process and maintains all the RBAC configurations.
And it proxies the http requests to the k8s cluster to each determined agent within the clusters.

The Proxy includes an UI, which is used for managing clusters that are registered in this proxy, so that i can access them.

It can add 2 types of cluster endpoints, EKS API and Agent based InCluster credentials.
EKS API basically calls the EKS endpoint with the required AWS policies.
InCluster Agent Clusters should have the gate proxy agent installed inside, so that it can call kubernetes api commands inside the cluster, using serviceaccount credentials.

## Agent
The agent is within the cluster as a pod, given a ServiceAccount with all access authorities.
It retrieves requests from the proxy, and performs the request to the api server, and returns the result to the proxy.

## CLI
The client is for authentication, which uses the OIDC device flow for authenticating the machine. This allows using various kubernetes tools like kubectl, k9s seamlessly without having to use our CLI as the actual tool for accessing data.
This is only for authentication and will check for those accesses when there is a requests approaching the proxy.