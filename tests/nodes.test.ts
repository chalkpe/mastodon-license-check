import nodes from '../data/nodes.json'
import { test, expect } from '@playwright/test'

test.describe(() =>
  nodes.forEach((domain) =>
    test.describe(domain, () => {
      test('라이선스 준수 체크', async ({ page }, testInfo) => {
        await page.goto(`https://${domain}/about`).catch(test.skip)

        await expect(page.getByRole('region'), '전용 에디션 적용 여부 체크')
          .toHaveText(/crepe.+에디션/i)
          .catch(test.skip)

        await expect(page.getByRole('link', { name: '소스코드' }), '수정된 소스코드를 제대로 공개했는지 체크').not.toHaveAttribute(
          'href',
          'https://github.com/mastodon/mastodon',
        )
      })
    }),
  ),
)
