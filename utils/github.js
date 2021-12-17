import { Octokit } from 'octokit';

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

function getCurrentYearAndMonth() {
  const today = new Date()
  return [today.getFullYear(), today.getMonth() + 1];
}

async function recordBillToGithub(output, text) {
  const [year, month] = getCurrentYearAndMonth()
  const path = `${year}/0-default/${month}-expenses.bean`

  var content = '';
  var sign = '';
  try {
    const response = await octokit.rest.repos.getContent({
      owner: 'kba977',
      repo: 'MyMoney',
      path: path
    });
    const { content: encodeContent, encoding, sha } = response.data;
    content = Buffer.from(encodeContent, encoding).toString();
    sign = sha
  } catch(e) {
    console.info(e.message)
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "kba977",
    repo: "MyMoney",
    path: path,
    message: text,
    content: Buffer.from(`${content}${output}\n\n`).toString('base64'),
    sha: sign
  });
}

module.exports.recordBillToGithub = recordBillToGithub