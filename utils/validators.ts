export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'register.weakPassword' };
  }
  return { valid: true };
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateAge(age: string): boolean {
  const num = parseInt(age, 10);
  return !isNaN(num) && num >= 13 && num <= 120;
}
