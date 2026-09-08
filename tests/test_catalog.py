import copy
import unittest

from scripts.catalog import load_catalog, validate_catalog


class CatalogValidationTests(unittest.TestCase):
    def setUp(self):
        self.catalog = load_catalog()

    def core_entry(self, entry_id="regenerative-impact-map"):
        return next(entry for entry in self.catalog["entries"] if entry["id"] == entry_id)

    def assert_has_error(self, fragment):
        errors = validate_catalog(self.catalog)
        self.assertTrue(any(fragment in error for error in errors), errors)

    def test_current_catalog_passes(self):
        self.assertEqual(validate_catalog(self.catalog), [])

    def test_core_requires_three_lenses(self):
        review = self.core_entry()["systemic_review"]
        review["lenses"] = dict(list(review["lenses"].items())[:2])
        self.assert_has_error("three to five lens objects")

    def test_core_requires_balancing_safeguard(self):
        self.core_entry()["systemic_review"]["balancing_safeguard"] = ""
        self.assert_has_error("balancing_safeguard must be a non-empty string")

    def test_unproven_field_status_is_rejected(self):
        self.core_entry()["systemic_review"]["status"] = "field-tested"
        self.assert_has_error("must be design-reviewed")

    def test_malformed_resource_list_reports_an_error(self):
        self.core_entry()["systemic_review"]["resource_ledger"]["tracked"] = [{}]
        self.assert_has_error("must be a non-empty array of strings")

    def test_review_is_reserved_for_core(self):
        core_review = copy.deepcopy(self.core_entry()["systemic_review"])
        general_entry = next(entry for entry in self.catalog["entries"] if entry["category"] == "development")
        general_entry["systemic_review"] = core_review
        self.assert_has_error("reserved for regenerative-core entries")

    def test_portfolio_requires_ecology(self):
        for entry in self.catalog["entries"]:
            review = entry.get("systemic_review")
            if review:
                review["lenses"].pop("ecology", None)
        self.assert_has_error("portfolio must cover all five systemic lenses")
        self.assert_has_error("at least two regenerative core entries")


if __name__ == "__main__":
    unittest.main()
