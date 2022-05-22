export default function formatMoney(amount = 0, currency = 'USD') {
  const options = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  };

  if (amount <= 99) {
    amount = amount * 100;
  }

  const formatter = Intl.NumberFormat('en-US', options);

  return formatter.format(amount / 100);
}
