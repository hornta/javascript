import React from 'react';

import { withRedirectToHome } from '../../ui/common/withRedirectToHome';
import { useEnvironment, useSignInContext } from '../../ui/contexts';
import { useNavigate } from '../../ui/hooks';
import { Button, descriptors, Flex, Flow, Icon } from '../customizables';
import { BlockButtonWithArrow, Card, CardAlert, Header } from '../elements';
import { useCardState } from '../elements/contexts';
import { SignOutDouble } from '../icons';
import { PropsOfComponent } from '../styledSystem';
import { useMultisessionActions } from '../UserButton/useMultisessionActions';
import { UserPreview, UserPreviewProps } from '../UserButton/UserPreview';

const _SignInAccountSwitcher = () => {
  const card = useCardState();
  const { navigate } = useNavigate();
  const { applicationName, userProfileUrl, signInUrl, afterSignOutAllUrl } = useEnvironment().displayConfig;
  const { navigateAfterSignIn } = useSignInContext();
  const { handleSignOutAllClicked, handleSessionClicked, activeSessions } = useMultisessionActions({
    navigateAfterSignOut: () => navigate(afterSignOutAllUrl),
    navigateAfterSwitchSession: navigateAfterSignIn,
    userProfileUrl,
    signInUrl,
  });

  return (
    <Flow.Part part='accountSwitcher'>
      <Card>
        <CardAlert>{card.error}</CardAlert>
        <Header.Root>
          <Header.Title>Signed out</Header.Title>
          <Header.Subtitle>Select account to continue to {applicationName}</Header.Subtitle>
        </Header.Root>
        {/*TODO: extract main in its own component */}
        <Flex
          direction='col'
          elementDescriptor={descriptors.main}
          sx={theme => ({ marginTop: theme.space.$8 })}
          gap={8}
        >
          <Flex direction='col'>
            {activeSessions.map(s => (
              <UserPreviewButton
                key={s.id}
                user={s.user}
                onClick={handleSessionClicked(s)}
              />
            ))}
          </Flex>
          <BlockButtonWithArrow
            isDisabled={card.isLoading}
            icon={
              <Icon
                icon={SignOutDouble}
                sx={theme => ({ color: theme.colors.$blackAlpha500 })}
              />
            }
            onClick={handleSignOutAllClicked}
          >
            Sign out of all accounts
          </BlockButtonWithArrow>
        </Flex>
      </Card>
    </Flow.Part>
  );
};
export const SignInAccountSwitcher = withRedirectToHome(_SignInAccountSwitcher);

type UserPreviewButtonProps = PropsOfComponent<typeof Button> & UserPreviewProps;

const UserPreviewButton = (props: UserPreviewButtonProps) => {
  const card = useCardState();
  const { user, ...rest } = props;

  return (
    <Button
      variant='ghost'
      colorScheme='neutral'
      focusRing={false}
      isDisabled={card.isLoading}
      sx={theme => ({ height: theme.sizes.$14, justifyContent: 'flex-start' })}
      {...rest}
    >
      <UserPreview user={user} />
    </Button>
  );
};
