export class TestApiService {
  private static instance: TestApiService;

  private constructor() { }

  public static getInstance(): TestApiService {
    if (!TestApiService.instance) {
      TestApiService.instance = new TestApiService();
    }
    return TestApiService.instance;
  }

  public async getTestList() {
    const response = await fetch('/api/student/tests');
    const data = await response.json();
    return data.data || [];
  }

  public async getTestQuestions(testId: number) {
    // 1. Trigger test start timing to set startTime in Database if null
    await fetch("/api/student/tests/startTest", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ testId }),
    });

    // 2. Fetch questions and test details
    const response = await fetch(`/api/student/tests/${testId}`);
    const data = await response.json();

    // Changed data.data to data.data?.questions to return array directly
    return data.data?.questions || [];
  }

  public async submitTest(testId: number, percentage: number, ansList: string[]) {
    try {
      const response = await fetch(`/api/student/tests/${testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ percentage, ansList })
      });

      if (!response.ok) {
        console.error("Failed to submit test");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error submitting test:", error);
      return false;
    }
  }
}