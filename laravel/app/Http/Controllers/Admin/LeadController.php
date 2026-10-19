<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadController extends Controller
{
    /**
     * Display leads list with search, filter, and KPI metrics.
     */
    public function index(Request $request): View
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $profile = $request->query('profile');

        $query = Lead::query()
            ->search($search)
            ->filterStatus($status)
            ->filterProfile($profile)
            ->orderBy('created_at', 'desc');

        $leads = $query->paginate(20)->withQueryString();

        // Calculate KPI metrics
        $totalLeads = Lead::count();
        $todayLeads = Lead::whereDate('created_at', today())->count();
        $newLeads = Lead::where('status', 'NEW')->count();
        $contactedLeads = Lead::whereIn('status', ['CONTACTED', 'QUALIFIED'])->count();
        $convertedLeads = Lead::where('status', 'CONVERTED')->count();
        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;

        // Breakdown by personality type
        $countA = Lead::whereIn('result_code', ['A', 'keep-it-cool'])->count();
        $countB = Lead::whereIn('result_code', ['B', 'smooth-operator'])->count();
        $countC = Lead::whereIn('result_code', ['C', 'patient-player'])->count();
        $countD = Lead::whereIn('result_code', ['D', 'opportunity-hunter'])->count();

        $pctA = $totalLeads > 0 ? round(($countA / $totalLeads) * 100) : 0;
        $pctB = $totalLeads > 0 ? round(($countB / $totalLeads) * 100) : 0;
        $pctC = $totalLeads > 0 ? round(($countC / $totalLeads) * 100) : 0;
        $pctD = $totalLeads > 0 ? round(($countD / $totalLeads) * 100) : 0;

        return view('admin.leads.index', [
            'leads' => $leads,
            'totalLeads' => $totalLeads,
            'todayLeads' => $todayLeads,
            'newLeads' => $newLeads,
            'contactedLeads' => $contactedLeads,
            'convertedLeads' => $convertedLeads,
            'conversionRate' => $conversionRate,
            'countA' => $countA,
            'countB' => $countB,
            'countC' => $countC,
            'countD' => $countD,
            'pctA' => $pctA,
            'pctB' => $pctB,
            'pctC' => $pctC,
            'pctD' => $pctD,
            'search' => $search,
            'status' => $status,
            'profile' => $profile,
            'statuses' => Lead::STATUSES,
        ]);
    }

    /**
     * Store a manually added lead from the admin panel.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'string', 'max:30'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'result_code' => ['required', 'string', 'in:A,B,C,D,keep-it-cool,smooth-operator,patient-player,opportunity-hunter'],
            'status' => ['nullable', 'string', 'in:' . implode(',', array_keys(Lead::STATUSES))],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $personas = [
            'A' => ['profile' => 'The Keep-It-Cool Investor', 'product' => 'First Capital Money Market Fund (FCMMF)*'],
            'keep-it-cool' => ['profile' => 'The Keep-It-Cool Investor', 'product' => 'First Capital Money Market Fund (FCMMF)*'],
            'B' => ['profile' => 'The Smooth Operator', 'product' => 'First Capital Fixed Income Fund (FCFIF)*'],
            'smooth-operator' => ['profile' => 'The Smooth Operator', 'product' => 'First Capital Fixed Income Fund (FCFIF)*'],
            'C' => ['profile' => 'The Patient Player', 'product' => 'Treasury Bonds*'],
            'patient-player' => ['profile' => 'The Patient Player', 'product' => 'Treasury Bonds*'],
            'D' => ['profile' => 'The Opportunity Hunter', 'product' => 'Equities*'],
            'opportunity-hunter' => ['profile' => 'The Opportunity Hunter', 'product' => 'Equities*'],
        ];

        $code = $validated['result_code'];
        $meta = $personas[$code] ?? $personas['A'];

        $lead = Lead::create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone' => trim($validated['phone']),
            'gender' => $validated['gender'] ?? 'male',
            'result_code' => $code,
            'result_profile' => $meta['profile'],
            'matched_product' => $meta['product'],
            'status' => strtoupper($validated['status'] ?? 'NEW'),
            'notes' => $validated['notes'] ? trim($validated['notes']) : null,
            'source' => 'Manual Admin Entry',
            'answers_json' => [],
        ]);

        return back()->with('success', "Lead #FC-{$lead->id} ({$lead->name}) created successfully.");
    }

    /**
     * Return lead details for view/modal.
     */
    public function show(Lead $lead): JsonResponse
    {
        return response()->json([
            'success' => true,
            'lead' => [
                'id' => 'FC-' . $lead->id,
                'dbId' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'gender' => $lead->gender,
                'result_code' => $lead->result_code,
                'result_profile' => $lead->result_profile,
                'matched_product' => $lead->matched_product,
                'status' => $lead->status,
                'notes' => $lead->notes,
                'source' => $lead->source,
                'created_at' => $lead->created_at->format('M d, Y H:i:s'),
                'answers' => $lead->answers_json,
            ],
        ]);
    }

    /**
     * Update lead status and advisory notes.
     */
    public function update(Request $request, Lead $lead): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(Lead::STATUSES))],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $lead->update([
            'status' => strtoupper($validated['status']),
            'notes' => $validated['notes'] ? trim($validated['notes']) : null,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully.',
                'lead' => $lead,
            ]);
        }

        return back()->with('success', "Lead #FC-{$lead->id} status updated to {$lead->status}.");
    }

    /**
     * Delete a lead record.
     */
    public function destroy(Request $request, Lead $lead): RedirectResponse|JsonResponse
    {
        $id = $lead->id;
        $lead->delete();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Lead #FC-{$id} deleted successfully.",
            ]);
        }

        return back()->with('success', "Lead #FC-{$id} has been permanently deleted.");
    }

    /**
     * Stream CSV export of all leads or filtered subset.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $profile = $request->query('profile');

        $query = Lead::query()
            ->search($search)
            ->filterStatus($status)
            ->filterProfile($profile)
            ->orderBy('created_at', 'desc');

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="first_capital_leads_' . date('Y_m_d_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');
            // Write UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'Lead ID',
                'Submission Date',
                'Full Name',
                'Email Address',
                'Phone Number',
                'Gender',
                'Profile Code',
                'Personality Profile',
                'Matched Product',
                'Status',
                'Advisory Notes',
                'Lead Source',
                'Answers Summary',
            ]);

            $query->chunk(100, function ($leads) use ($handle) {
                foreach ($leads as $lead) {
                    $answersSummary = '';
                    if (is_array($lead->answers_json)) {
                        $parts = [];
                        foreach ($lead->answers_json as $ans) {
                            $qId = $ans['questionId'] ?? ($ans['id'] ?? '?');
                            $sel = $ans['selected'] ?? ($ans['key'] ?? '');
                            $parts[] = "Q{$qId}:{$sel}";
                        }
                        $answersSummary = implode(', ', $parts);
                    }

                    fputcsv($handle, [
                        'FC-' . $lead->id,
                        $lead->created_at->format('Y-m-d H:i:s'),
                        $lead->name,
                        $lead->email,
                        $lead->phone,
                        ucfirst($lead->gender),
                        $lead->result_code,
                        $lead->result_profile,
                        $lead->matched_product,
                        $lead->status,
                        $lead->notes,
                        $lead->source,
                        $answersSummary,
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
}
