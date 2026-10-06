import { handleCreateLead, handleGetLeads } from '../src/server/api-handlers.ts';

async function test() {
  console.log('--- Testing Lead Submission for "Jason" ---');
  
  const leadPayload = {
    name: 'Jason',
    email: 'jason@example.com',
    phone: '0771234567',
    gender: 'male',
    profileKey: 'B',
    profileName: 'The Smooth Operator',
    matchedProduct: 'First Capital Fixed Income Fund (FCFIF)',
    answers: { 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 7: 'B' },
    status: 'NEW',
    notes: 'Test entry for Jason'
  };

  const createRes = await handleCreateLead(leadPayload);
  console.log('Create result:', createRes);

  const getRes = await handleGetLeads();
  console.log('Total leads now in database:', getRes.leads.length);
  const foundJason = getRes.leads.find(l => l.name.toLowerCase().includes('jason'));
  console.log('Found Jason in database:', foundJason);

  process.exit(0);
}

test().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
