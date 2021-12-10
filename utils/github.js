import { Octokit } from 'octokit';

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

async function recordBillToGithub(output, text) {
  const response = await octokit.rest.repos.getContent({
    owner: 'kba977',
    repo: 'MyMoney',
    path: '2021/0-default/12-expenses.bean'
  });
  const { content: encodeContent, encoding, sha, path } = response.data;
  const content = Buffer.from(encodeContent, encoding).toString();

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "kba977",
    repo: "MyMoney",
    path: path,
    message: text,
    content: Buffer.from(`${content}${output}\n\n`).toString('base64'),
    sha: sha
  });
}

module.exports.recordBillToGithub = recordBillToGithub