# Medisys 

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Input.tsx       # Custom input with validation
│   └── index.ts        # Component exports
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx  # Main navigation stack
│   └── types.ts        # Navigation type definitions
├── screens/            # Application screens
│   ├── LoginScreen.tsx # Login with email/password
│   ├── HomeScreen.tsx  # Home dashboard
│   └── index.ts        # Screen exports
└── theme/              # Design system
    ├── colors.ts       # color palette
    ├── spacing.ts      # Spacing constants
    ├── typography.ts   # Typography system
    └── index.ts        # Theme exports
```


## Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```
