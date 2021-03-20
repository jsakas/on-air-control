# On Air Control

## Development

```bash
yarn install
yarn dev
```

1. Go to chrome://extensions/
2. Click "Load Unpacked"
3. Navigate to code build/chrome

### Create distribution zip

Configure environment variables:

```
export WEB_EXT_API_KEY=xxx;
export WEB_EXT_API_SECRET=xxx
```

Sign and build plugin:

```
yarn dist
```

See INSTALL.md for dist install instructions
