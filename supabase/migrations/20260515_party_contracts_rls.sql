-- Allow authenticated users to view contracts where they are listed as a party
-- This fixes the issue where invited signatories cannot see contracts in their list

CREATE POLICY "party_can_view_contract"
ON public.contracts
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.contract_parties cp
    WHERE cp.contract_id = id
      AND lower(cp.email) = lower(auth.email())
  )
);

-- Also allow parties to view the related contract_parties rows for those contracts
-- (needed so the full contract with signatories loads correctly)
CREATE POLICY "party_can_view_contract_parties"
ON public.contract_parties
FOR SELECT
USING (
  lower(email) = lower(auth.email())
  OR
  EXISTS (
    SELECT 1
    FROM public.contracts c
    WHERE c.id = contract_id
      AND c.owner_id = auth.uid()
  )
);

-- Allow parties to view clauses of contracts they are party to
CREATE POLICY "party_can_view_contract_clauses"
ON public.contract_clauses
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.contract_parties cp
    WHERE cp.contract_id = contract_id
      AND lower(cp.email) = lower(auth.email())
  )
  OR
  EXISTS (
    SELECT 1
    FROM public.contracts c
    WHERE c.id = contract_id
      AND c.owner_id = auth.uid()
  )
);
