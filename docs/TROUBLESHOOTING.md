# Troubleshooting

## Common Issues

### Authentication Errors
- Verify `BUILDKITE_API_TOKEN` is set in your environment
- Check API token has required permissions
- Confirm proxy configuration in `app-config.yaml`

### Missing Build Data
- Verify pipeline slug format: `organization-slug/pipeline-slug`
- Check organization and pipeline names are correct
- Ensure builds exist within selected date range
- Confirm all filters are set correctly

### Real-time Updates Not Working
- Check browser tab is active (updates pause in background)
- Verify network connectivity
- Ensure API token hasn't expired

### Build Logs Not Loading
- Confirm API token has `read_builds` permission
- Check build exists and is accessible
- Verify proxy configuration can handle log requests