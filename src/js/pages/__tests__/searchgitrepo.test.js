import { GetSearchUrl, UpdateSearchUrl, FetchGitRepo, DetectPosition, IsOverRateLimit } from "../searchgitrepo";


describe('Test GetSearchUrl', () => {
    test('Test null', () => {
        expect(GetSearchUrl({})).toBe(null);
    });
    test('React key Word.', () => {
        expect(GetSearchUrl({ keyWord: 'React' })).toBe("https://api.github.com/search/repositories?q=React&sort=stars&order=desc&per_page=30");
    });
    test('Google key Word and pre page 5.', () => {
        expect(GetSearchUrl({ keyWord: 'Google', perPage: 5 })).toBe("https://api.github.com/search/repositories?q=Google&sort=stars&order=desc&per_page=5");
    });
});



describe('Test UpdateSearchUrl', () => {
    test('Test null.', () => {
        expect(UpdateSearchUrl({})).toBe(null);
    });
    test('Test React page 5.', () => {
        expect(UpdateSearchUrl({ url: "/search/repositories?q=React&sort=stars&order=desc&per_page=30", page: 5 })).toBe("/search/repositories?q=React&sort=stars&order=desc&per_page=30&page=5");
    });
    test('Test React negative page number.', () => {
        expect(UpdateSearchUrl({ url: "/search/repositories?q=React&sort=stars&order=desc&per_page=30", page: -1 })).toBe("/search/repositories?q=React&sort=stars&order=desc&per_page=30");
    });
});



describe('Test FetchGitRepo', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    test('Test null.', async () => {
        const result = await FetchGitRepo({ url: "", keyWord: "" });
        expect(result.total_count).toBe(0);
        expect(result.items.length).toBe(0);
    });

    test('Test fake data.', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ total_count: 50, items: [{}, {}] })
            })
        );

        const result = await FetchGitRepo({ url: "Test", keyWord: "test" });

        expect(result.total_count).toBe(50);
        expect(result.items.length).toBe(2);
    });

    test('Test fake data with no url.', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ total_count: 30, items: [{}, {}, {}] })
            })
        );

        const result = await FetchGitRepo({ url: "", keyWord: "test" });

        expect(result.total_count).toBe(30);
        expect(result.items.length).toBe(3);
    });
});



describe('Test DetectPosition', () => {
    test('Test null.', () => {
        expect(DetectPosition()).toBe(false);
        expect(DetectPosition({})).toBe(false);
        expect(DetectPosition(null, {})).toBe(false);
    });

    test('Test not in display window.', () => {
        let dom = { top: 500, height: 30 };
        let win = { innerHeight: 300 };
        expect(DetectPosition(dom, win)).toBe(false);
    });

    test('Test  in display window.', () => {
        let dom = { top: 500, height: 30 };
        let win = { innerHeight: 600 };
        expect(DetectPosition(dom, win)).toBe(true);
    });
});




describe('Test IsOverRateLimit', () => {
    test('Test no date.', () => {
        const result = IsOverRateLimit(0, null);
        expect(result.notOver).toBe(false);
        expect(result.reset).toBe(false);
    });
    test('Test over in 1 mins.', () => {
        let now = new Date();
        let thirtySec = new Date(now.getTime() - 30000);
        const result = IsOverRateLimit(10, thirtySec);
        expect(result.notOver).toBe(false);
        expect(result.reset).toBe(false);
    });
    test('Test not over in 1 mins.', () => {
        let now = new Date();
        let thirtySec = new Date(now.getTime() - 30000);
        const result = IsOverRateLimit(8, thirtySec);
        expect(result.notOver).toBe(true);
        expect(result.reset).toBe(false);
    });
    test('Test replace date.', () => {
        let now = new Date();
        let thirtySec = new Date(now.getTime() - 300000);
        const result = IsOverRateLimit(8, thirtySec);
        expect(result.notOver).toBe(true);
        expect(result.reset).toBe(true);
    });
});
