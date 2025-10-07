const negativeCases = [
    { user: 'T-10', pass: '123',        error: 'incorrect username.' },
    { user: 'T-10', pass: '12345678',   error: 'incorrect username.' },
    { user: 'T-103-test.in', pass: '123456', regex: /Incorrect password.*\d+/ },
  ];