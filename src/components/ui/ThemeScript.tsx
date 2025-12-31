export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        var stored = localStorage.getItem('georgina-theme');
        if (stored) {
          var parsed = JSON.parse(stored);
          var theme = parsed.state && parsed.state.theme;
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          }
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
