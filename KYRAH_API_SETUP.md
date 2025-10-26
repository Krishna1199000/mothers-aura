# Kyrah API Setup

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Kyrah API Credentials
KYRAH_API_USERNAME="your-actual-username"
KYRAH_API_PASSWORD="your-actual-password"
```

## API Endpoint Details

- **URL**: `https://kyrahapi.azurewebsites.net/api`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Parameters**: 
  - USERNAME: Your Kyrah username
  - PASSWORD: Your Kyrah password

## Troubleshooting

If you're getting "No Data Found!" response:

1. **Check Credentials**: Ensure your username and password are correct
2. **Environment Variables**: Make sure they're set in `.env.local`
3. **API Access**: Verify you have access to the Kyrah API
4. **Network**: Check if the API endpoint is accessible

## Testing API

You can test the API directly using curl:

```bash
curl -X POST https://kyrahapi.azurewebsites.net/api \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "USERNAME=your-username&PASSWORD=your-password"
```

## Expected Response

A successful response should look like:

```json
{
  "success": true,
  "message": "Data Found.",
  "data": [
    {
      "StockID": "2DDD436-2",
      "Certificate No": "600304406",
      "Shape": "ASSCHER",
      "Size": 10.07,
      "Color": "C",
      "Clarity": "SI1",
      // ... more fields
    }
  ]
}
```














