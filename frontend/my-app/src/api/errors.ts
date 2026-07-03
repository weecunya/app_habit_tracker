const messages: Record<string, string> = {
  "Invalid password": "Неверный пароль.",
  "User not found": "Пользователь не найден.",
  "User already exists": "Пользователь уже существует.",
  "Not authenticated": "Войдите в аккаунт заново.",
  "Only one partner can be added": "Можно добавить только одного партнера.",
  "Проверьте заполнение полей.": "Проверьте заполнение полей.",
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return messages[error.message] ?? error.message;
  }

  return "Неожиданная ошибка.";
}
