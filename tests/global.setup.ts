import { test as setup } from '@playwright/test';
import { execSync } from 'child_process';

setup('reset test db', async () => {
  console.log('Resetting test.db');
  execSync('npm run reset:test');
});
