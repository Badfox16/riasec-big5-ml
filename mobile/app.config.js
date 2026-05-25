export default {
  expo: {
    name: "eiVocação",
    slug: "eivocacao-riasec",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      backgroundColor: "#06B6D4",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "mz.eivocacao.riasec",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#06B6D4",
      },
      package: "mz.eivocacao.riasec",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
    },
  },
};
