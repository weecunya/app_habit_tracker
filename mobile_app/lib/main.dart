import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const siteUrl = String.fromEnvironment(
  'SITE_URL',
  defaultValue: 'http://10.0.2.2:5173',
);

void main() {
  runApp(const HabitTrackerApp());
}

class HabitTrackerApp extends StatelessWidget {
  const HabitTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Habit Tracker',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6F8AB7),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const HabitTrackerWebView(),
    );
  }
}

class HabitTrackerWebView extends StatefulWidget {
  const HabitTrackerWebView({super.key});

  @override
  State<HabitTrackerWebView> createState() => _HabitTrackerWebViewState();
}

class _HabitTrackerWebViewState extends State<HabitTrackerWebView> {
  late final WebViewController controller;
  var loadingProgress = 0;
  String? errorText;

  @override
  void initState() {
    super.initState();

    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF0B0D10))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (progress) {
            setState(() {
              loadingProgress = progress;
            });
          },
          onPageStarted: (_) {
            setState(() {
              errorText = null;
            });
          },
          onPageFinished: (_) {
            setState(() {
              loadingProgress = 100;
            });
          },
          onWebResourceError: (error) {
            setState(() {
              errorText = 'Не удалось открыть сайт: ${error.description}';
            });
          },
        ),
      )
      ..loadRequest(Uri.parse(siteUrl));
  }

  Future<void> handleBackNavigation(BuildContext context) async {
    if (await controller.canGoBack()) {
      await controller.goBack();
      return;
    }

    if (context.mounted) {
      Navigator.of(context).maybePop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        if (didPop) return;
        await handleBackNavigation(context);
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF0B0D10),
        body: SafeArea(
          child: Stack(
            children: [
              WebViewWidget(controller: controller),
              if (loadingProgress < 100)
                LinearProgressIndicator(value: loadingProgress / 100),
              if (errorText != null)
                WebViewErrorView(
                  message: errorText!,
                  onRetry: () {
                    setState(() {
                      errorText = null;
                      loadingProgress = 0;
                    });
                    controller.reload();
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class WebViewErrorView extends StatelessWidget {
  const WebViewErrorView({
    super.key,
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0B0D10),
      padding: const EdgeInsets.all(24),
      alignment: Alignment.center,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.wifi_off, size: 48),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 8),
          Text(
            siteUrl,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh),
            label: const Text('Повторить'),
          ),
        ],
      ),
    );
  }
}