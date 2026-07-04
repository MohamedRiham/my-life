export function formatTaskDateTime(value: string | null | undefined) {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatTaskDateRange(startAt: string | null | undefined, endAt: string | null | undefined) {
  const hasStart = Boolean(startAt);
  const hasEnd = Boolean(endAt);

  if (!hasStart && !hasEnd) {
    return 'No schedule';
  }

  if (hasStart && hasEnd) {
    return `${formatTaskDateTime(startAt)} - ${formatTaskDateTime(endAt)}`;
  }

  if (hasStart) {
    return `Starts ${formatTaskDateTime(startAt)}`;
  }

  return `Ends ${formatTaskDateTime(endAt)}`;
}
